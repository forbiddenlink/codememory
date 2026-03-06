import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RatingButtons } from './rating-buttons'
import { FlashcardDisplay } from './flashcard-display'
import { AllCaughtUp } from './all-caught-up'
import { LoadingState } from './loading-state'

describe('RatingButtons', () => {
  it('renders all four rating buttons', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} disabled={false} />)

    expect(screen.getByText('Again')).toBeInTheDocument()
    expect(screen.getByText('Hard')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('calls onRate with correct value when button clicked', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} disabled={false} />)

    fireEvent.click(screen.getByText('Again'))
    expect(onRate).toHaveBeenCalledWith(1)

    fireEvent.click(screen.getByText('Hard'))
    expect(onRate).toHaveBeenCalledWith(2)

    fireEvent.click(screen.getByText('Good'))
    expect(onRate).toHaveBeenCalledWith(3)

    fireEvent.click(screen.getByText('Easy'))
    expect(onRate).toHaveBeenCalledWith(4)
  })

  it('disables buttons when disabled prop is true', () => {
    const onRate = vi.fn()
    render(<RatingButtons onRate={onRate} disabled={true} />)

    const againButton = screen.getByText('Again').closest('button')
    expect(againButton).toBeDisabled()
  })
})

describe('FlashcardDisplay', () => {
  it('renders question (front) text', () => {
    render(
      <FlashcardDisplay
        front="What is React?"
        back="A JavaScript library"
        codeExample={null}
        showAnswer={false}
      />
    )

    expect(screen.getByText('What is React?')).toBeInTheDocument()
    expect(screen.getByText('Question')).toBeInTheDocument()
  })

  it('hides answer when showAnswer is false', () => {
    render(
      <FlashcardDisplay
        front="What is React?"
        back="A JavaScript library"
        codeExample={null}
        showAnswer={false}
      />
    )

    expect(screen.queryByText('A JavaScript library')).not.toBeInTheDocument()
    expect(screen.queryByText('Answer')).not.toBeInTheDocument()
  })

  it('shows answer when showAnswer is true', () => {
    render(
      <FlashcardDisplay
        front="What is React?"
        back="A JavaScript library"
        codeExample={null}
        showAnswer={true}
      />
    )

    expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
    expect(screen.getByText('Answer')).toBeInTheDocument()
  })

  it('shows code example when provided and answer is shown', () => {
    render(
      <FlashcardDisplay
        front="What is React?"
        back="A JavaScript library"
        codeExample="const App = () => <div>Hello</div>"
        showAnswer={true}
      />
    )

    expect(screen.getByText('Example')).toBeInTheDocument()
    expect(screen.getByText('const App = () => <div>Hello</div>')).toBeInTheDocument()
  })

  it('does not show code example when showAnswer is false', () => {
    render(
      <FlashcardDisplay
        front="What is React?"
        back="A JavaScript library"
        codeExample="const App = () => <div>Hello</div>"
        showAnswer={false}
      />
    )

    expect(screen.queryByText('Example')).not.toBeInTheDocument()
  })
})

describe('AllCaughtUp', () => {
  it('renders celebration message', () => {
    render(<AllCaughtUp />)

    expect(screen.getByText('All Caught Up!')).toBeInTheDocument()
    expect(screen.getByText('No cards due for review right now.')).toBeInTheDocument()
  })

  it('renders link to dashboard', () => {
    render(<AllCaughtUp />)

    const link = screen.getByRole('link', { name: /back to dashboard/i })
    expect(link).toHaveAttribute('href', '/dashboard')
  })
})

describe('LoadingState', () => {
  it('renders loading skeleton', () => {
    render(<LoadingState />)

    // The loading state should render something (skeleton UI)
    const container = document.querySelector('.min-h-screen')
    expect(container).toBeInTheDocument()
  })
})
