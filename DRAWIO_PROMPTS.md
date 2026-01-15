# Draw.io AI Prompts - Board User Flow

## Hướng Dẫn Sử Dụng

1. Mở https://app.diagrams.net/ (draw.io)
2. Chọn "Create New Diagram"
3. Click vào biểu tượng AI (hoặc nhấn Ctrl/Cmd + K)
4. Copy từng prompt dưới đây và paste vào
5. AI sẽ tự động vẽ biểu đồ

---

## PROMPT 1: Luồng Hoạt Động Với Boards

```
Create a flowchart diagram for a Board Management System user flow with the following structure:

START: User Login
↓
Dashboard (main hub)
↓
User selects from menu:
- Boards (main path)
- Templates
- Tasks
- Settings

From Boards path:
↓
Display Boards List with options:
- Search/Filter boards
- Show all boards

↓
Categorize boards:
- Starred Boards
- Recent Boards
- All Accessible Boards

↓
User chooses:
PATH A: Create New Board
- Click "Create Board"
- Dialog opens with fields:
  * Select Background (required)
  * Enter Title (min 3 chars, required)
  * Select Visibility (Public/Private)
- Validate input
- If invalid → return to input
- If valid → API: createNewBoardAPI
- If success → Add to Recent Boards → Navigate to new board
- If error → Show error message → return to boards list

PATH B: Open Existing Board
- Click on a board
- Check permissions:
  * 403 Forbidden → Access Denied → Back to Dashboard with error
  * 404 Not Found → Board Not Found → Back to Dashboard with error
  * 200 OK → Continue
- API: fetchBoardDetailsAPI
- Load board data (Columns, Cards, Members, Permissions)
- Connect WebSocket for real-time updates
- Add to Recent Boards
- Open Board Detail Page

From Board Detail Page:
- User can perform actions (see Diagram 2)
- When leaving board → Disconnect WebSocket → Back to Dashboard

Color coding:
- Green: Start/Success states
- Blue: Main pages/screens
- Orange: Board Detail (transition to Diagram 2)
- Red: Error states
- Yellow: Decision points

Use modern flowchart style with rounded rectangles for processes, diamonds for decisions, and clear directional arrows.
```

---

## PROMPT 2: Luồng Thao Tác Bên Trong Board

```
Create a detailed flowchart diagram for Board Detail Page operations with the following structure:

MAIN INTERFACE:
Board Detail Page splits into:
1. Board Bar (Header section)
2. Board Content (Main area)
3. WebSocket (Real-time updates - shown with dashed lines)

BOARD BAR ACTIONS (6 main features):

1. Edit Title:
- Click on title → Edit mode → Enter new title → Save (Enter/Click outside)
- API: updateBoardDetailsAPI → Success → Return to board

2. Change Visibility:
- Click Visibility button → Menu shows Public/Private options
- Select option → API: updateBoardDetailsAPI → Success → Return to board

3. Toggle Star:
- Check if already starred
- If starred → API: removeStarBoardAPI
- If not starred → API: addStarBoardAPI
- Update status → Return to board

4. Filter Cards:
- Click Filter icon → Filter dialog opens
- Select filter conditions:
  * Term (keyword search)
  * Overdue (past deadline)
  * Due Tomorrow (deadline tomorrow)
  * No Due (no deadline)
- Apply with 500ms debounce → API: fetchBoardDetailsAPI with params
- Show filtered results
- If filters active → Show Reset button
- Click Reset → Clear all filters → Fetch all data → Return to board

5. Manage Members:
- Choose action:
  A) Invite: Search user → Select user → API: addMemberToBoardAPI → Success
  B) Remove: Select member → Confirm → API: removeMemberFromBoardAPI → Success
  C) View: Display list (Admin + Members)
- Return to board

6. Actions Menu:
- Choose option:
  A) Change board status → Select new status → API: handleChangStateBoard
  B) Change admin → Select new member → Confirm → API: changeAdminAPI
  C) Create template → Enter template info → API: createTemplateAPI
  D) Delete board → Confirm → API: deleteBoardAPI → Navigate to Dashboard
- Return to board (except delete)

BOARD CONTENT ACTIONS (3 main features):

1. Manage Columns:
A) Create Column:
- Check permission CREATE_COLUMN
- If no permission → Error: "No permission"
- If has permission → Enter column name → API: createNewColumnAPI
- Create column with placeholder card → Return to board

B) Delete Column:
- Check permission DELETE_COLUMN
- If no permission → Error: "No permission"
- If has permission → Confirm → API: deleteColumnDetailsAPI
- Delete column and all cards inside → Return to board

C) Move Column:
- Check permission MOVING_COLUMN
- If no permission → Error: "No permission"
- If has permission → Drag & Drop column → Update columnOrderIds
- API: updateBoardDetailsAPI
- If success → Save new state
- If error → Rollback to old state → Show error
- Return to board

2. Manage Cards:
Create Card:
- Check if filtering active
- If filtering → Error: "Cannot create while filtering"
- If not filtering → Check permission CREATE_CARD
- If no permission → Error: "No permission"
- If has permission → Enter card info → API: createNewCardAPI
- Create card (replace placeholder if exists) → Return to board

3. Drag & Drop Cards:
- Check if filtering active
- If filtering → Error: "Cannot move while filtering"
- If not filtering → Check permission MOVING_CARD
- If no permission → Error: "No permission"
- If has permission → Drop card → Check if same column

A) Same Column:
- Update cardOrderIds in column → API: updateColumnDetailsAPI
- If success → Save new state
- If error → Rollback to old state → Show error

B) Different Column:
- Update cardOrderIds of both columns → Handle placeholder card if needed
- API: moveCardToDifferentColumnAPI
- If success → Save new state
- If error → Rollback to old state → Show error
- Return to board

WEBSOCKET REAL-TIME:
Show with dashed lines connecting to Board Interface:
- Listen to events:
  * Columns changed
  * Cards changed
  * Members changed
  * Board info changed
- Auto sync all changes back to Board Interface

Color coding:
- Green: Start/Success states
- Blue: Main interface
- Yellow: Board Bar section
- Purple: Board Content section
- Red: Error states (permissions, filtering, API errors)
- Cyan: WebSocket/Real-time updates
- Orange: Decision points

Use modern flowchart style with clear sections, rounded rectangles for processes, diamonds for decisions, and dashed lines for real-time connections.
```

---

## PROMPT 3: Biểu Đồ Tổng Hợp (Tùy Chọn)

Nếu bạn muốn 1 biểu đồ tổng hợp đơn giản hơn:

```
Create a high-level system architecture flowchart for a Kanban Board Management System:

LEVEL 1 - USER ENTRY:
Login → Dashboard

LEVEL 2 - DASHBOARD NAVIGATION:
Dashboard has 4 menu options:
1. Boards (main feature)
2. Templates
3. Tasks
4. Settings

LEVEL 3 - BOARDS SECTION:
From Boards menu:
- View boards list (Starred, Recent, All Accessible)
- Search/Filter boards
- Create new board (Dialog: Background + Title + Visibility)
- Select existing board

LEVEL 4 - BOARD DETAIL:
When opening a board:
- Check permissions (403/404 → Error, 200 → Continue)
- Load data (Columns, Cards, Members, Permissions)
- Connect WebSocket

Board Detail has 2 main sections:

A) BOARD BAR (Header):
- Edit title
- Change visibility (Public/Private)
- Star/Unstar board
- Filter cards (Term, Overdue, Due Tomorrow, No Due)
- Manage members (Invite, Remove, View)
- Actions menu (Change status, Change admin, Create template, Delete board)

B) BOARD CONTENT (Main area):
- Manage Columns (Create, Delete, Move with drag & drop)
- Manage Cards (Create, Move with drag & drop)
- Permission checks for all actions
- Rollback mechanism for drag & drop operations
- Cannot create/move when filtering is active

C) WEBSOCKET:
- Real-time sync for all changes
- Auto-update from other users

LEVEL 5 - EXIT:
Leave board → Disconnect WebSocket → Back to Dashboard

Use hierarchical layout with clear groupings, modern colors, and icons where appropriate. Show main data flow with solid arrows and real-time updates with dashed arrows.
```

---

## Tips Sử Dụng Draw.io AI

### Để Có Kết Quả Tốt Nhất:

1. **Chọn Layout phù hợp:**

   - Prompt 1: Chọn "Vertical Flow" hoặc "Top to Bottom"
   - Prompt 2: Chọn "Hierarchical" hoặc "Organic"
   - Prompt 3: Chọn "Hierarchical" hoặc "Tree"

2. **Tùy chỉnh sau khi AI vẽ:**

   - Điều chỉnh kích thước nodes
   - Thay đổi màu sắc theo ý thích
   - Thêm icons từ thư viện draw.io
   - Sắp xếp lại layout cho đẹp hơn

3. **Xuất file:**

   - File → Export as → PNG (cho hình ảnh)
   - File → Export as → SVG (cho vector, scale tốt hơn)
   - File → Save as → .drawio (để chỉnh sửa sau)

4. **Nếu AI không hiểu:**
   - Chia nhỏ prompt thành nhiều phần
   - Vẽ từng section riêng rồi ghép lại
   - Sử dụng Prompt 3 (đơn giản hơn) trước

---

## Lưu Ý Quan Trọng

- **Prompt 1** phù hợp cho luồng tổng quan (từ login đến vào board)
- **Prompt 2** phù hợp cho chi tiết thao tác trong board (phức tạp hơn)
- **Prompt 3** phù hợp nếu bạn muốn 1 biểu đồ tổng hợp đơn giản

Nếu draw.io AI không vẽ được do quá phức tạp, hãy:

1. Sử dụng Prompt 3 trước
2. Hoặc chia Prompt 2 thành nhiều biểu đồ nhỏ hơn (Board Bar riêng, Board Content riêng)
3. Sau đó ghép các biểu đồ lại với nhau trong draw.io
