import { FilterOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Form, FormInstance } from 'antd'
import { debounce } from 'lodash'
import { useMemo, useRef } from 'react'

type IProps = {
  children: React.ReactNode | ((form: FormInstance) => React.ReactNode)
  onFilterChange: (values: unknown) => void
  onResetFields: () => void
  formRef?: React.RefObject<FormInstance<any>>
}

export default function FilterContainer({ children, onFilterChange, onResetFields, formRef }: IProps) {
  const [form] = Form.useForm()
  const onFilterChangeRef = useRef(onFilterChange)
  onFilterChangeRef.current = onFilterChange

  // Create a debounced function that persists across renders
  const debouncedFilterChange = useMemo(
    () =>
      debounce((values: unknown) => {
        onFilterChangeRef.current(values)
      }, 500),
    []
  )

  const handleChangeFilter = (_changedValues: unknown, allValues: unknown) => {
    // Trim all string fields dynamically
    const processedValues = { ...(allValues as Record<string, unknown>) }

    // Iterate through all values and trim string fields
    Object.keys(processedValues).forEach((key) => {
      const value = processedValues[key]
      if (typeof value === 'string') {
        processedValues[key] = value.trim()
      }
    })

    debouncedFilterChange(processedValues)
  }

  const handleResetForm = () => {
    form.resetFields()
    onResetFields()
  }

  return (
    <Card
      className='!mb-[10px] overflow-visible relative shadow-sm !rounded-xl !border-gray-200'
    >
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          left: '20px',
          background: '#7367f0',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '14px',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '2px solid white',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          transform: 'translateZ(0)',
          zIndex: 9
        }}
      >
        <FilterOutlined style={{ marginRight: 5 }} />
        Bộ lọc
      </div>
      <Form form={form} layout='inline' onValuesChange={handleChangeFilter} ref={formRef}>
        <div className='filter-form-container'>{typeof children === 'function' ? children(form) : children}</div>
      </Form>

      <div className='flex justify-end top-[-34px] right-[24px] absolute'>
        <Button
          className='mt-4'
          icon={<ReloadOutlined />}
          onClick={() => {
            handleResetForm()
          }}
        >
        </Button>
      </div>
    </Card>
  )
}
