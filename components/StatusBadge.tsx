interface StatusBadgeProps {
  status: 'available' | 'reserved' | 'sold'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-gray-100 text-gray-800'
  }

  const labels = {
    available: '판매중',
    reserved: '예약중',
    sold: '판매완료'
  }

  return (
    <span className={`inline-flex px-2 py-1 rounded text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
