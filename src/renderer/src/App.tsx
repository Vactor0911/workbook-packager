import { Button, CssBaseline, Stack } from '@mui/material'

function App(): JSX.Element {
  return (
    <>
      <CssBaseline />
      <Stack width={'100vw'} height={'100vh'} css={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        Hello World!
      </Stack>
    </>
  )
}

export default App
