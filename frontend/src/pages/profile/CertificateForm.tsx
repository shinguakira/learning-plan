import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/form/FormField'
import type { FormEvent } from 'react'


const CertificateForm = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // add function here
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add a certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <FormField label="Title:" htmlFor="certificate-title" className="min-w-48 flex-1">
              <Input className="" />
            </FormField>
            <FormField label="Issued by:" htmlFor="certificate-title" className="min-w-48 flex-1">
              <Input className="" />
            </FormField>
            <FormField label="Date Earned:" htmlFor="certificate-title" className="min-w-48 flex-1">
              <Input type="date" />
            </FormField>
          </div>
          <Button type="submit" className="mt-2 cursor-pointer">
            <Plus />
            Add Certificate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CertificateForm
