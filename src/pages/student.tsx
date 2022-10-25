import { useViewerID } from '@self.id/framework'
import { Box, Button, Form, FormField, Text, TextArea, TextInput } from 'grommet'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import NotesList from '../components/NotesList'
import { useDraftNote } from '../hooks'

export default function NewNotePage() {
  const draft = useDraftNote()
  const viewer = useViewerID()
  const router = useRouter()

  const isLoading = draft.state.status === 'loading'

  const onSubmit = useCallback(async () => {
    const notePage = await draft.publish()
    if (notePage) {
      await router.push(notePage)
    }
  }, [draft, router])

  const sidebar = viewer ? (
    <NotesList did={viewer.id} />
  ) : (
    <Box direction="column" width="medium" pad="medium">
      <Text>Not connected</Text>
    </Box>
  )

  return (
    <Box direction="row" flex>
      {sidebar}
      <Box direction="column" flex pad="medium">
        <Form
          value={draft.value}
          onChange={(nextValue) => draft.setValue(nextValue)}
          onReset={() => draft.resetValue()}
          onSubmit={onSubmit}>
          <FormField name="title" htmlFor="text-input-title" label="Student Name">
            <TextInput autoFocus disabled={isLoading} id="text-input-title" name="title" />
          </FormField>
          <FormField name="id" htmlFor="text-input-id" label="Student ID">
            <TextArea disabled={isLoading} id="text-input-id" name="id" />
          </FormField>
          <FormField name="col_name" htmlFor="text-input-col_name" label="College Name">
            <TextArea disabled={isLoading} id="text-input-col_name" name="col_name" />
          </FormField>
          <FormField name="col_id" htmlFor="text-input-col_id" label="College ID">
            <TextArea disabled={isLoading} id="text-input-col_id" name="col_id" />
          </FormField>
          <FormField name="phone" htmlFor="text-input-phone" label="Phone No.">
            <TextArea disabled={isLoading} id="text-input-phone" name="phone" />
          </FormField>
          <Box direction="row" gap="medium">
            <Button
              disabled={!draft.isValid || isLoading}
              type="submit"
              primary
              style={{ color: 'white' }}
              label={isLoading ? 'creating...' : 'Student Details'}
            />
            <Button disabled={isLoading} type="reset" label="Reset" />
          </Box>
        </Form>
      </Box>
    </Box>
  )
}
