import { forwardRef } from 'react'

const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  helper,
  className = '',
  ...props 
}, ref) => {
  const baseStyles = 'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
  
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input