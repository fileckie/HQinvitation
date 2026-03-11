import PasswordGate from '@/components/PasswordGate'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PasswordGate>{children}</PasswordGate>
}
