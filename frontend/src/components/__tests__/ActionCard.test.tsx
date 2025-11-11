import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ActionCard } from '@/components/ActionCard'

const action = {
  id: 1,
  title: 'Test Action',
  description: 'Sample description',
  status: 'OPEN',
  priority: 'HIGH',
  due_date: '2024-05-01',
  tags: [
    { id: 1, name: 'Tag1' },
    { id: 2, name: 'Tag2' },
  ],
  created_at: '2024-04-01T00:00:00Z',
  updated_at: '2024-04-01T00:00:00Z',
} as const

describe('ActionCard', () => {
  it('renders action details', () => {
    render(<ActionCard action={action} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Test Action')).toBeInTheDocument()
    expect(screen.getByText(/Sample description/)).toBeInTheDocument()
    expect(screen.getByText('OPEN')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('#Tag1')).toBeInTheDocument()
  })
})
