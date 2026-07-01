# Hướng dẫn refactor DnD: Bỏ placeholder, dùng pattern chuẩn `@dnd-kit`

> Mục tiêu: Tự tay refactor luồng kéo-thả card giữa các column trong Board để hiểu sâu `@dnd-kit`, đồng thời fix bug "kéo card cuối cùng sang column khác không tạo được placeholder".
>
> Nguyên tắc: **Đọc doc → phá code → sửa lại → verify từng bước**. Không copy-paste mù.

---

## Vấn đề hiện tại

Code Board đang dùng **placeholder card** (`FE_PlaceholderCard`) làm hack để cột rỗng vẫn có thể nhận card thả vào. Đây là pattern của thư viện `react-beautiful-dnd`, **không phải** của `@dnd-kit`.

### Placeholder rò rỉ ra 8+ chỗ trong codebase

| Nơi | Vấn đề |
|-----|--------|
| `src/utils/formatters.js` | `generatePlaceholderCard` (có typo `placehorlder`) |
| `src/components/Board/Board.jsx` (4 chỗ) | Inject placeholder khi createColumn, refetch, filter, reconcile |
| `src/components/Board/BoardContent/BoardContent.jsx` (2 chỗ) | Tạo placeholder khi source empty, filter placeholder ở target |
| `src/components/Board/BoardContent/ListColumns/Column/ListCards/Card/Card.jsx` | Style ẩn placeholder (`opacity: 0`, `height: 0`) |
| `src/sockets/board/boardSocketHandlers.js` (2 chỗ) | Inject placeholder khi nhận socket event |

→ 1 khái niệm không tồn tại trong `@dnd-kit` phải chăm sóc ở 8+ chỗ. Sót 1 chỗ là bug.

### Pattern chuẩn của `@dnd-kit` cho multi-list

Column **tự đăng ký làm sortable container** qua `useSortable({ id, data: { type: 'column' } })`. Khi cột rỗng, `over.id` sẽ là **chính column id** — collision detection giữ nguyên, không downgrade xuống card gần nhất. Không cần placeholder.

Reference chính chủ: [MultipleContainers.tsx](https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx)

---

## Bước 0: Đọc doc chính chủ (30-45 phút — KHÔNG BỎ QUA)

Đọc **theo thứ tự**, không skim:

1. **Introduction** — https://docs.dndkit.com/introduction/getting-started
   Nắm 3 khái niệm: `DndContext`, `Draggable`, `Droppable`. (~5 phút)

2. **Sortable preset** — https://docs.dndkit.com/presets/sortable
   Hiểu `SortableContext`, `useSortable`, sorting strategies. (~10 phút)

3. **Collision detection** ⚠️ **QUAN TRỌNG NHẤT** — https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
   Đọc kỹ 4 algorithm: `rectIntersection`, `closestCenter`, `closestCorners`, `pointerWithin`. Hiểu khi nào dùng cái nào. (~15 phút)

4. **Multiple containers example** — [MultipleContainers.tsx](https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx)
   Đọc từ đầu đến cuối. Đây là reference cho case của bạn. (~15-20 phút)

### Sau khi đọc, tự trả lời được 3 câu này thì mới sang bước 1:

- [ ] Vì sao `@dnd-kit` không cần placeholder mà `react-beautiful-dnd` cần?
- [ ] `useSortable` khác `useDroppable` chỗ nào?
- [ ] Khi nào `collisionDetection` trả về column id, khi nào trả về card id?

---

## Bước 1: Vẽ mental model (10 phút)

Trước khi động code, vẽ ra giấy sơ đồ này:

```
DndContext
├── activeId (id đang kéo)
├── overId (id đang hover)
└── collisionDetectionStrategy: cách tính overId

Column A (id: colA, data.type: 'column')
├── useSortable({ id: 'colA' })   ← Column tự là 1 sortable item (kéo cả cột)
└── SortableContext (items: [cardA1._id, cardA2._id])
    ├── Card A1 (useSortable({ id: cardA1._id }))
    └── Card A2 (useSortable({ id: cardA2._id }))

Column B (id: colB, data.type: 'column')
├── useSortable({ id: 'colB' })
└── SortableContext (items: [])   ← RỖNG, không có placeholder
```

### Key insights

- **Column vừa là sortable (để kéo cả cột), vừa là container chứa cards.** Không phải 2 concept riêng.
- **Khi cột rỗng, `over.id === column._id`** (không phải card id nào cả). `handleDragOver` phải xử lý case này.
- **Phân biệt active là column hay card** bằng `active.data.current?.type === 'column'`, KHÔNG bằng `data?.cardOrderIds` (fragile).

---

## Bước 2: Phá code trước, sửa sau (học bằng cách thấy nó vỡ)

Đây là bước **quan trọng nhất**. Đừng skip.

### 2.1. Xóa inject placeholder ở `fetchBoardData`

File: `src/components/Board/Board.jsx`

Sửa `withPlaceholderIfEmpty` thành no-op (hoặc xóa hẳn):

```js
// Trước:
const withPlaceholderIfEmpty = (column) => {
  if (isEmpty(column.cardOrderIds)) {
    const placeholder = generatePlaceholderCard(column)
    return { ...column, cards: [placeholder], cardOrderIds: [placeholder._id] }
  }
  return column
}

// Sau (tạm thời — để thấy nó vỡ):
const withPlaceholderIfEmpty = (column) => column
```

### 2.2. Mở app và test

- Tạo 1 board có 2 column, mỗi cột 2-3 cards.
- Kéo hết card từ column A sang column B.
- Thử kéo 1 card từ B ngược lại A → **không kéo được**.

Đây là bug bạn nói ban đầu. Bây giờ bạn đã tận mắt thấy **vì sao code cũ phải hack placeholder**.

### 2.3. Bật `console.log` để hiểu vấn đề

Trong `BoardContent.jsx > collisionDetectionStrategy`, thêm:

```js
console.log('overId after downgrade:', overId, 'checkColumn:', checkColumn?._id)
```

Kéo card sang column rỗng — bạn sẽ thấy `overId = undefined` khi cột rỗng (vì đoạn `closestCorners([]).at(0)?.id` trả về `undefined`). Đó là root cause.

**Bây giờ bạn hiểu vì sao cần refactor.** Sang bước 3.

---

## Bước 3: Refactor từng file

### File 1 — `src/components/Board/BoardContent/ListColumns/Column/Column.jsx`

Thêm `type: 'column'` vào `data` của `useSortable`:

```js
// Trước:
const { attributes, listeners, ... } = useSortable({
  id: column._id,
  data: { ...column }
})

// Sau:
const { attributes, listeners, ... } = useSortable({
  id: column._id,
  data: { ...column, type: 'column' }
})
```

**Vì sao**: `active.data.current?.type` sẽ giúp phân biệt drag column vs drag card ở mọi nơi (thay cho trick check `cardOrderIds` cũ).

### File 2 — `src/components/Board/BoardContent/ListColumns/Column/ListCards/Card/Card.jsx`

Tương tự, thêm `type: 'card'` (không bắt buộc nhưng consistency):

```js
const { attributes, listeners, ... } = useSortable({
  id: card._id,
  data: { ...card, type: 'card' },
  disabled: openDialog
})
```

Xóa các style ẩn placeholder:

```js
// XÓA những dòng này trong sx:
opacity: card.FE_PlaceholderCard ? '0' : '1',
minWidth: card.FE_PlaceholderCard ? '242px' : 'unset',
minHeight: card.FE_PlaceholderCard ? '0px' : 'unset',
height: card.FE_PlaceholderCard ? '0px' : 'unset',
pointerEvents: card.FE_PlaceholderCard ? 'none' : 'auto',
```

### File 3 — `src/components/Board/BoardContent/BoardContent.jsx`

#### 3.1. Viết lại `findColumnByCardId` → `findContainer`

```js
// Trước:
const findColumnByCardId = (cardId) => {
  return columns.find((column) =>
    column?.cards?.map((card) => card._id)?.includes(cardId)
  )
}

// Sau:
const findContainer = (id) => {
  // Case 1: id là column id (drop vào cột rỗng hoặc drop vào chính column node)
  const asColumn = columns.find((c) => c._id === id)
  if (asColumn) return asColumn
  // Case 2: id là card id — tìm column chứa nó
  return columns.find((c) => c.cards?.some((card) => card._id === id))
}
```

#### 3.2. Đổi cách phân biệt drag column vs card

```js
// Trước (handleDragStart):
setActiveDragType(
  event?.active?.data?.current?.cardOrderIds
    ? ACTIVE_DRAG_ITEM_TYPE.COLUMN
    : ACTIVE_DRAG_ITEM_TYPE.CARD
)

// Sau:
const type = event?.active?.data?.current?.type
setActiveDragType(
  type === 'column' ? ACTIVE_DRAG_ITEM_TYPE.COLUMN : ACTIVE_DRAG_ITEM_TYPE.CARD
)
```

#### 3.3. Viết lại `collisionDetectionStrategy`

Đây là chỗ khó nhất. Đọc kỹ ví dụ MultipleContainers song song, rồi rewrite:

```js
import { closestCenter, pointerWithin, rectIntersection, getFirstCollision } from '@dnd-kit/core'

const collisionDetectionStrategy = useCallback((args) => {
  // 1. Kéo column: chỉ va chạm với column khác
  if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) => c.data.current?.type === 'column'
      )
    })
  }

  // 2. Kéo card: dùng pointer, fallback rect
  const pointerIntersections = pointerWithin(args)
  const intersections = pointerIntersections.length > 0
    ? pointerIntersections
    : rectIntersection(args)
  let overId = getFirstCollision(intersections, 'id')

  if (overId != null) {
    // Nếu over là column
    const overColumn = columns.find((c) => c._id === overId)
    if (overColumn) {
      // Cột CÓ card → downgrade xuống card gần nhất TRONG column đó
      // Cột RỖNG → giữ nguyên overId = columnId (điểm khác code cũ!)
      if (overColumn.cards.length > 0) {
        const nearest = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (c) => c.id !== overId && overColumn.cards.some((card) => card._id === c.id)
          )
        })[0]?.id
        overId = nearest ?? overId  // fallback về column id nếu không tìm được
      }
    }
    lastOverId.current = overId
    return [{ id: overId }]
  }
  return lastOverId.current ? [{ id: lastOverId.current }] : []
}, [activeDragType, columns])
```

**Điểm khác code cũ**: nếu cột rỗng thì **KHÔNG downgrade** → `overId` giữ nguyên là column id.

#### 3.4. Cập nhật `handleDragOver`

```js
const handleDragOver = (event) => {
  if (!event?.active || !event?.over) return
  if (activeDragType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

  const { active, over } = event
  const draggingCardId = active.id
  const overId = over.id

  const sourceCol = findContainer(draggingCardId)
  const targetCol = findContainer(overId)  // <-- giờ handle được cả column id lẫn card id

  if (!sourceCol || !targetCol) return
  if (sourceCol._id === targetCol._id) return

  moveCardBetweenDifferentColumns(
    targetCol,
    overId,           // <-- có thể là card id HOẶC column id
    active,
    over,
    sourceCol,
    draggingCardId,
    activeDragData,
    'handleDragOver'
  )
}
```

#### 3.5. Cập nhật `moveCardBetweenDifferentColumns`

```js
const moveCardBetweenDifferentColumns = (
  targetColumn, targetIdOrCardId, active, over, sourceCol,
  draggingCardId, draggingCardData, triggerFrom
) => {
  setColumns((prevColumns) => {
    const isOverColumn = targetIdOrCardId === targetColumn._id
    const overCardIndex = isOverColumn
      ? -1
      : targetColumn.cards.findIndex((c) => c._id === targetIdOrCardId)

    let newCardIndex
    if (isOverColumn) {
      // Drop vào cột rỗng (hoặc drop vào chính column node) → thả cuối
      newCardIndex = targetColumn.cards.length
    } else if (overCardIndex >= 0) {
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      newCardIndex = overCardIndex + (isBelowOverItem ? 1 : 0)
    } else {
      newCardIndex = targetColumn.cards.length
    }

    const nextColumns = cloneDeep(prevColumns)
    const source = nextColumns.find((c) => c._id === sourceCol._id)
    const target = nextColumns.find((c) => c._id === targetColumn._id)

    if (source) {
      source.cards = source.cards.filter((c) => c._id !== draggingCardId)
      // KHÔNG tạo placeholder khi source rỗng nữa!
      source.cardOrderIds = source.cards.map((c) => c._id)
    }

    if (target) {
      target.cards = target.cards.filter((c) => c._id !== draggingCardId)
      const rebuiltCard = { ...draggingCardData, columnId: target._id }
      target.cards = target.cards.toSpliced(newCardIndex, 0, rebuiltCard)
      // KHÔNG cần filter FE_PlaceholderCard nữa!
      target.cardOrderIds = target.cards.map((c) => c._id)
    }

    if (triggerFrom === 'handleDragEnd') {
      moveCardToDifferentColumn(draggingCardId, oldColumn._id, target._id, nextColumns)
    }
    return nextColumns
  })
}
```

**Chú ý bug cũ đã fix ở đây**: trong `handleDragEnd`, `sourceCol` được tìm lại và có thể trả về column mới (vì card đã được `handleDragOver` chuyển đi). Cách sạch là dùng `oldColumn` làm nguồn khi `triggerFrom === 'handleDragEnd'`:

```js
// Trong handleDragEnd — dùng oldColumn thay cho findContainer:
if (oldColumn._id !== targetCol._id) {
  moveCardBetweenDifferentColumns(
    targetCol,
    overId,
    active,
    over,
    oldColumn,        // <-- dùng oldColumn từ handleDragStart, KHÔNG tìm lại
    draggingCardId,
    activeDragData,
    'handleDragEnd'
  )
}
```

### File 4 — `src/components/Board/Board.jsx`

#### 4.1. Xóa `withPlaceholderIfEmpty` và `isPlaceholderId`

```js
// XÓA:
const isPlaceholderId = (id) => typeof id === 'string' && id.includes('placehorlder-card')
const withPlaceholderIfEmpty = (column) => { ... }

// Sửa fetchBoardData:
boardRes.columns = boardRes.columns || []
```

#### 4.2. Xóa inject placeholder trong `createNewColumn`

Tìm dòng `const placeholder = generatePlaceholderCard(column)` (dòng ~33 và ~131), xóa nguyên block đó. Column mới sẽ có `cards: []`, `cardOrderIds: []`.

#### 4.3. Xóa `.filter(!FE_PlaceholderCard)` + inject placeholder trong reconcile

Trong `moveCardToDifferentColumn` (dòng ~229-249):

```js
// Trước:
const newCards = newIds.length === 0
  ? [generatePlaceholderCard(col)]
  : mapOrder(col.cards.filter((c) => !c.FE_PlaceholderCard), newIds, '_id')
return { ...col, cardOrderIds: newIds.length === 0 ? [] : newIds, cards: newCards }

// Sau:
const newCards = mapOrder(col.cards, newIds, '_id')
return { ...col, cardOrderIds: newIds, cards: newCards }
```

Cũng xóa `clean = (ids) => (isPlaceholderId(ids?.[0]) ? [] : ids || [])` — không cần nữa.

### File 5 — `src/sockets/board/boardSocketHandlers.js`

Tìm 2 chỗ dùng `generatePlaceholderCard` (dòng ~8 và ~65), xóa. Column rỗng chỉ đơn giản là `cards: []`.

### File 6 — `src/utils/formatters.js`

Xóa hàm `generatePlaceholderCard`. Cũng xóa mọi import `generatePlaceholderCard` ở các file trên.

---

## Bước 4: Verify checklist thủ công

Sau khi refactor xong, chạy dev server và test **tất cả** các case:

- [ ] Kéo card trong cùng column (reorder trong 1 cột).
- [ ] Kéo card sang column khác (target còn card).
- [ ] Kéo card **cuối cùng** sang column khác → source thành rỗng. Kiểm tra: cột nguồn vẫn nhận card khác thả vào được không?
- [ ] **Kéo card vào column rỗng** (bug ban đầu).
- [ ] Kéo card ra ngoài droppable rồi thả → không crash, UI không lệch.
- [ ] Reorder column (kéo cả cột).
- [ ] Tạo column mới → thả card vào ngay lập tức được không?
- [ ] Refresh page giữa lúc đang kéo → không crash.
- [ ] Mở 2 tab cùng board → kéo ở tab 1 → tab 2 sync qua socket đúng, không lỗi.
- [ ] Filter (search/overdue/dueTomorrow) rồi thử kéo → block đúng (không cho kéo khi filtering).
- [ ] Board CLOSED → không cho kéo.

Nếu tất cả pass → bạn đã master pattern MultipleContainers của dnd-kit. 🎉

---

## Tips học nhanh

### 1. `console.log(activeId, overId)` là bạn thân
Trong `handleDragOver`, log ra:
```js
console.log('active:', active.id, 'over:', over.id, 'overType:', over.data.current?.type)
```
Kéo card, hover qua các vùng khác nhau — thấy `overId` thay đổi theo. Là cách nhanh nhất hiểu collision detection.

### 2. React DevTools
Mở tab Components → tìm `DndContext` → xem props `sensors`, `collisionDetection`. Verify code bạn viết được truyền đúng.

### 3. Đừng đọc code cũ trước rồi mới đọc doc
Ngược lại: doc trước → tự nghĩ mình sẽ viết thế nào → so với code cũ → thấy code cũ sai chỗ nào.

### 4. Khi kẹt, ping tôi kèm câu hỏi CỤ THỂ
- ❌ "Fix hộ" → tôi không giúp.
- ✅ "Tại sao khi tôi bỏ filter placeholder ở dòng 112 thì card bị nhân đôi trong target column?" → tôi giải thích.

### 5. Commit từng bước nhỏ
Sau mỗi File (1 → 6), commit riêng. Nếu lỡ sai có thể `git bisect` tìm nhanh.

---

## Checklist "bạn thực sự lên trình"

Sau khi làm xong, tự trả lời được:

- [ ] Vì sao `@dnd-kit` không cần placeholder mà `react-beautiful-dnd` cần?
- [ ] `pointerWithin` khác `rectIntersection` khác `closestCorners` chỗ nào? Khi nào dùng cái nào?
- [ ] `SortableContext` khác `useSortable` khác `useDroppable` chỗ nào?
- [ ] Khi nào `over.id` là column id, khi nào là card id?
- [ ] Vì sao `handleDragOver` phải setState optimistic mà `handleDragEnd` mới gọi API? (Hint: liên quan đến việc `over` liên tục thay đổi khi hover.)
- [ ] Vì sao trong `handleDragEnd` phải dùng `oldColumn` (lưu từ `handleDragStart`) thay vì `findContainer(active.id)`?

Trả lời được 6 câu này = nắm dnd-kit sâu hơn 80% dev từng dùng nó.

---

## Reference

- Doc chính chủ dnd-kit: https://docs.dndkit.com/
- Ví dụ MultipleContainers (code): https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx
- Storybook demo: https://5fc05e08a4a65d0021ae0bf2-cvsyzoltoy.chromatic.com/?path=/story/presets-sortable-multiple-containers--basic-setup

## File touch trong refactor này

| File | Loại thay đổi |
|------|---------------|
| `src/components/Board/BoardContent/ListColumns/Column/Column.jsx` | Thêm `type: 'column'` vào data |
| `src/components/Board/BoardContent/ListColumns/Column/ListCards/Card/Card.jsx` | Thêm `type: 'card'`, xóa style placeholder |
| `src/components/Board/BoardContent/BoardContent.jsx` | Rewrite `findContainer`, `collisionDetection`, `handleDragOver`, `moveCardBetweenDifferentColumns` |
| `src/components/Board/Board.jsx` | Xóa `withPlaceholderIfEmpty`, `isPlaceholderId`, các chỗ inject placeholder |
| `src/sockets/board/boardSocketHandlers.js` | Xóa inject placeholder |
| `src/utils/formatters.js` | Xóa `generatePlaceholderCard` |

Tổng: **6 files**, chủ yếu là **xóa code**. Sau refactor, codebase nhẹ hơn ~80-120 dòng.
