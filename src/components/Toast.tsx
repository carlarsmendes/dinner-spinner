type ToastProps = {
  message: string
}

export const Toast = ({ message }: ToastProps) => (
  <div className="toast" role="status" aria-live="polite">
    <span className="toast__spark">✨</span>
    <span>{message}</span>
  </div>
)
