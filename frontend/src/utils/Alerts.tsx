import { Alert, AlertDescription } from "@/components/ui/alert"

type AlertsProps = {
  error: string
}

const Alerts = ({ error }: AlertsProps) => {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  )
}

export default Alerts