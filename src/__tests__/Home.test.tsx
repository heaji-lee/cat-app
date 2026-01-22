import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'
import * as api from '../api/cats'
import { vi, MockedFunction } from 'vitest'
import type { CatImage } from '../api/cats'

vi.mock('../api/cats')

describe('Home Page', () => {
  const mockCats: CatImage[] = [
    { id: '1', url: 'cat1.jpg', favourite: undefined, score: 0 },
    { id: '2', url: 'cat2.jpg', favourite: undefined, score: 0 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    
    ;(api.fetchCatImages as MockedFunction<typeof api.fetchCatImages>).mockResolvedValue(
      mockCats
    )
    ;(api.fetchVotes as MockedFunction<typeof api.fetchVotes>).mockResolvedValue([
      { image_id: '1', value: 5 },
      { image_id: '2', value: 3 },
    ])
    ;(api.fetchRandomCatImage as MockedFunction<typeof api.fetchRandomCatImage>).mockResolvedValue({
      id: '3',
      url: 'random-cat.jpg',
      favourite: undefined,
      score: 0,
    })
    ;(api.favouriteCatImage as MockedFunction<typeof api.favouriteCatImage>).mockResolvedValue('fav-1')
    ;(api.voteCat as MockedFunction<typeof api.voteCat>).mockResolvedValue()
    ;(api.deleteCatImage as MockedFunction<typeof api.deleteCatImage>).mockResolvedValue()
  })

  it('shows loading then renders cat images', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByText(/loading cats/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByAltText(/cat/i)).toHaveLength(2)
    })
  })

  it('renders random cat if no cats returned', async () => {
    (api.fetchCatImages as MockedFunction<typeof api.fetchCatImages>).mockResolvedValue([])

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByAltText(/cat/i)).toHaveAttribute('src', 'random-cat.jpg')
    })
  })

  it('can favourite a cat', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    await waitFor(() => screen.getAllByAltText(/cat/i))

    const heartButtons = screen.getAllByRole('button', { name: /favourite/i })
    expect(heartButtons.length).toBe(2)

    await userEvent.click(heartButtons[0])

    // Should call API
    expect(api.favouriteCatImage).toHaveBeenCalledWith({
      id: '1', url: 'cat1.jpg', favourite: undefined, score: 5
    })
  })

  it('can vote on a cat', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    await waitFor(() => screen.getAllByAltText(/cat/i))

    const upvoteButtons = screen.getAllByRole('button', { name: /Vote up/i })
    await userEvent.click(upvoteButtons[0])

    expect(api.voteCat).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', url: 'cat1.jpg', favourite: undefined, score: 5 }),
      true
    )
  })

  it('can delete a cat', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    await waitFor(() => screen.getAllByAltText(/cat/i))

    const deleteButtons = screen.getAllByRole('button', { name: /delete this cat/i })
    await userEvent.click(deleteButtons[0])

    expect(api.deleteCatImage).toHaveBeenCalledWith(
      { ...mockCats[0], score: 5, favourite: undefined }
    )
  })
})