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

  const debouncedFilterChange = useMemo(
    () =>
      debounce((values: unknown) => {
        onFilterChangeRef.current(values)
      }, 500),
    []
  )

  const handleChangeFilter = (_changedValues: unknown, allValues: unknown) => {
    const processedValues = { ...(allValues as Record<string, unknown>) }
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
        styles={{ body: { padding: '24px 16px 20px' } }}
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

      {/* Form filter */}
      <Form form={form} layout='inline' onValuesChange={handleChangeFilter} ref={formRef}>
        <div 
          className='filter-form-container' 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px', 
            alignItems: 'flex-end'
          }}
        >
          {typeof children === 'function' ? children(form) : children}
        </div>
      </Form>

      {/* Nút reload  */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '-12px',
          right: '20px',
          zIndex: 10,
          top: '-14px',
          
        }}
      >
        <Button
          icon={<ReloadOutlined />}
          onClick={handleResetForm}
          size="small"
          style={{
            borderRadius: '50%',
            height: '28px',
            width: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            border: '1px solid #d9d9d9'
          }}
        />
      </div>
    </Card>
  )
}