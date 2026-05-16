// TODO: replace with real fetch when backend is ready
export async function submitResponse(
  batchId: number,
  identity: { studentId: string; studentName: string; studentEmail: string },
  answers: Record<string, any>,
): Promise<void> {
  await new Promise(r => setTimeout(r, 600))
  console.log('[submitResponse]', { batchId, identity, answers })
  // Production:
  // await fetch(`/api/batches/${batchId}/responses`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ...identity, answers }),
  // })
}
