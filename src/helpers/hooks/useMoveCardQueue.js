import { useRef, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

/**
 * Queue tuan tu cho cac request move-card.
 *
 * Tai sao can:
 * - UI optimistic update ngay sau khi user keo, nhung BE co the cham (>500ms).
 * - Neu user keo nhanh, nhieu request bay song song -> snapshot 'Before' cua request sau
 *   co the lech voi state DB neu request truoc chua xong -> BE tra 409 sai hoac ghi de loan.
 * - Queue dam bao request gui tuan tu: request sau chi gui khi request truoc da xong,
 *   nen snapshot Before luon khop DB (vi optimistic state da duoc BE xac nhan).
 *
 * Khi mot request trong queue fail (409 hoac network):
 * - Bat co isResetting -> bo qua moi task con lai trong queue (chung deu dang dua tren
 *   state optimistic da bi sai, neu chay tiep se loop loi).
 * - Goi onReset() de fetch lai state DB.
 * - Sau khi reset xong, ha co -> san sang nhan task moi.
 */
export function useMoveCardQueue(onReset) {
  const queueRef = useRef(Promise.resolve())
  const isResettingRef = useRef(false)
  // Luu callback vao ref de enqueue khong phu thuoc vao identity cua onReset
  // (caller co the truyen inline function moi moi render).
  const onResetRef = useRef(onReset)
  useEffect(() => {
    onResetRef.current = onReset
  }, [onReset])

  const enqueue = useCallback((apiCall) => {
    queueRef.current = queueRef.current.then(async () => {
      if (isResettingRef.current) return
      try {
        await apiCall()
      } catch (error) {
        if (isResettingRef.current) return
        isResettingRef.current = true
        const status = error?.response?.status
        if (status === 409) {
          toast.warn('Dữ liệu đã thay đổi, đang tải lại...')
        } else {
          toast.error('Lỗi khi di chuyển card, đang tải lại...')
        }
        try {
          await onResetRef.current?.()
        } finally {
          isResettingRef.current = false
        }
      }
    })
  }, [])

  return enqueue
}
