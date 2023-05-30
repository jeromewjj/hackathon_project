import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import React, { useState } from 'react'

function MarketValueForm() {
  const [file, setFile] = useState()

  const fileReader = new FileReader()

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0])
  }

  const handleOnSubmit = (e: any) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = function (event: any) {
        const csvOutput = event.target.result
      }

      fileReader.readAsText(file)
    }
  }

  return (
    <Button
      variant='contained'
      component='label'
      onClick={(e) => {
        handleOnSubmit(e)
      }}
      endIcon={<AttachFileIcon />}
    >
      Upload CSV
      <input
        type={'file'}
        hidden
        id={'csvFileInput'}
        accept={'.csv'}
        onChange={handleOnChange}
      />
    </Button>
  )
}
export default MarketValueForm
