import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getBatchById } from '../../../feature/alumni/api'
import type { SurveyBatch } from '../../../feature/alumni/types'
import { SurveyPreview } from '../../admin/Form/Preview'
import { IdentifyStep } from './IdentifyStep'
import type { Identity } from './IdentifyStep'
import { DoneScreen } from './DoneScreen'
import { NotActiveScreen } from './NotActiveScreen'
import { LoadingScreen, ErrorScreen } from './StatusScreens'
import { submitResponse } from './submitResponse'

type PageState = 'loading' | 'error' | 'not-active' | 'identify' | 'fill' | 'done'

export default function SurveyFillPage() {
  const { id } = useParams<{ id: string }>()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [batch,     setBatch]     = useState<SurveyBatch | null>(null)
  const [identity,  setIdentity]  = useState<Identity | null>(null)

  useEffect(() => {
    if (!id) { setPageState('error'); return }
    getBatchById(Number(id))
      .then(b => {
        setBatch(b)
        const now   = new Date()
        const start = new Date(b.startDate)
        const end   = new Date(b.endDate)
        if (b.status !== 'active' || now < start || now > end) {
          setPageState('not-active')
        } else {
          setPageState('identify')
        }
      })
      .catch(() => setPageState('error'))
  }, [id])

  const handleIdentify = (info: Identity) => {
    setIdentity(info)
    setPageState('fill')
  }

  const handleSubmit = async (answers: Record<string, any>) => {
    if (!batch || !identity) return
    await submitResponse(batch.id, identity, answers)
    setPageState('done')
  }

  switch (pageState) {
    case 'loading':    return <LoadingScreen />
    case 'error':      return <ErrorScreen />
    case 'not-active': return <NotActiveScreen batch={batch} />
    case 'done':       return <DoneScreen batch={batch} />
    case 'identify':   return batch ? <IdentifyStep batch={batch} onContinue={handleIdentify} /> : null
    case 'fill':
      return batch?.formSnapshot
        ? <SurveyPreview
            form={batch.formSnapshot}
            onSubmit={handleSubmit}
            submitLabel="Gửi phiếu khảo sát"
            onBack={() => setPageState('identify')}
          />
        : null
    default: return null
  }
}
