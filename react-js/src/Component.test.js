import React from 'react'
import Component from './Component'
import {render, fireEvent, screen} from '@testing-library/react'

test('matches snapshot', () => {
  const { asFragment } = render(<Component />)
  expect(asFragment()).toMatchSnapshot()
})

test('increments count on button click', () => {
  // Render the component
  render(<Component />)

  // Find the button element
  const button = screen.getByRole('button', { name: /Increment/i })
  
  // expect button has class name btn
  expect(button).toHaveClass('btn')

  // Assert initial count
  expect(screen.getByText(/Count: 0/i)).toBeInTheDocument() 

  // Simulate a click on the button
  fireEvent.click(button)

  // Assert count after click
  expect(screen.getByText(/Count: 1/i)).toBeInTheDocument() 
})
