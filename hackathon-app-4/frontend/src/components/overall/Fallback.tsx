import { Skeleton } from '@mui/lab'
import Typography from '@mui/material/Typography'
import React from 'react'
import Layout from './Layout'

export default function Fallback() {
  return (
    <Layout>
      <Typography variant='h4'>
        <Skeleton />
      </Typography>
      <Skeleton variant='rounded' height={30} />
    </Layout>
  )
}
