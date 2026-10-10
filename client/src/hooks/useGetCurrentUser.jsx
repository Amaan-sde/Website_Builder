import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'

export default function useGetCurrentUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${serverUrl}/api/user/me`, {
        withCredentials: true,
      })
      setUser(data)
      setError(null)
    } catch (err) {
      setUser(null)
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    axios
      .get(`${serverUrl}/api/user/me`, { withCredentials: true })
      .then(({ data }) => {
        if (isMounted) {
          setUser(data)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setUser(null)
          setError(err.response?.data?.message || err.message)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { user, loading, error, getCurrentUser }
}
