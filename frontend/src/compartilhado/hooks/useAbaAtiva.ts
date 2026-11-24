import { useEffect, useState } from 'react'

function lerHash(): string {
  return window.location.hash.replace('#', '')
}

export function useAbaAtiva(ids: readonly string[], padrao: string): string {
  const [hash, setHash] = useState(lerHash)

  useEffect(() => {
    const atualizar = () => setHash(lerHash())
    window.addEventListener('hashchange', atualizar)
    return () => window.removeEventListener('hashchange', atualizar)
  }, [])

  return ids.includes(hash) ? hash : padrao
}
