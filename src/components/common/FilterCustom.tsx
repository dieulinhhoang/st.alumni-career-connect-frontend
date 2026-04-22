import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Popover, Checkbox, DatePicker, Tag, theme, ConfigProvider } from 'antd';
import { PlusOutlined, SearchOutlined, CloseOutlined, CalendarOutlined, FilterFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

// --- Types ---
export type FilterInputType = 'text' | 'select' | 'date' | 'dateRange';

export interface FilterOption {
	label: string;
	value: string | number;
}

export interface FilterColumn {
	title: string;
	dataIndex: string;
	type: FilterInputType;
	options?: FilterOption[];
	placeholder?: string;
	width?: number; // Optional width for inputs
}

interface IProps {
	columns: FilterColumn[];
	onFilterChange?: (values: any) => void;
	onResetFields?: () => void;
	className?: string;
}

const { RangePicker } = DatePicker;

// --- Sub-Component: FilterItem ---
const FilterItem = ({
	column,
	value,
	onChange
}: {
	column: FilterColumn;
	value: any;
	onChange: (val: any) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isEditingText, setIsEditingText] = useState(false);
	const inputRef = useRef<any>(null);

	// Auto-focus input when entering edit mode
	useEffect(() => {
		if (isEditingText && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditingText]);

	const handleClear = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		onChange(null); // Clear value
		setIsEditingText(false);
	};

	// --- RENDER: TEXT INPUT ---
	if (column.type === 'text') {
		const hasValue = value !== undefined && value !== null && value !== '';

		// If active (editing or has value), show Input
		if (isEditingText || hasValue) {
			return (
				<div className="relative flex items-center">
					<Input
						ref={inputRef}
						placeholder={column.placeholder || column.title}
						value={value || ''}
						onChange={(e) => onChange(e.target.value)}
						onBlur={() => {
							// If empty on blur, revert to button
							if (!value) setIsEditingText(false);
						}}
						className="rounded-md text-sm"
						style={{ width: column.width || 200 }}
						prefix={<span className="text-gray-400 mr-1">{column.title}:</span>}
						suffix={
							hasValue ? (
								<CloseOutlined
									className="text-gray-400 hover:text-gray-600 cursor-pointer text-[10px]"
									onClick={handleClear}
								/>
							) : null
						}
					/>
				</div>
			);
		}

		// Default: Button
		return (
			<Button
				type="dashed"
				icon={<PlusOutlined />}
				onClick={() => setIsEditingText(true)}
				className="text-gray-500 border-gray-300 hover:text-blue-600 hover:border-blue-600 bg-white"
			>
				{column.title}
			</Button>
		);
	}

	// --- RENDER: OTHER TYPES (Select, Date) ---
	const hasValue = Array.isArray(value) ? value.length > 0 : (value !== undefined && value !== null);

	const renderPopoverContent = () => {
		if (column.type === 'date') {
			return (
				<div className="p-2">
					<DatePicker
						value={value ? dayjs(value) : null}
						onChange={(date) => onChange(date ? date.toISOString() : null)}
						className="w-full"
						format="DD/MM/YYYY"
					/>
				</div>
			);
		}
		if (column.type === 'dateRange') {
			return (
				<div className="p-2">
					<RangePicker
						value={value ? [dayjs(value[0]), dayjs(value[1])] : null}
						onChange={(dates) => onChange(dates ? [dates[0]?.toISOString(), dates[1]?.toISOString()] : null)}
					/>
				</div>
			);
		}
		// Default: Select (Checkbox Group)
		return (
			<div className="max-h-60 overflow-y-auto p-2 w-56">
				<Checkbox.Group
					className="flex flex-col gap-2"
					value={value || []}
					onChange={(vals) => onChange(vals)}
				>
					{column.options?.map((opt) => (
						<Checkbox key={opt.value} value={opt.value} className="ml-0">
							{opt.label}
						</Checkbox>
					))}
				</Checkbox.Group>
			</div>
		);
	};

	// Label generation for tags
	const getDisplayLabel = () => {
		if (column.type === 'date' && value) return dayjs(value).format('DD/MM/YYYY');
		if (column.type === 'dateRange' && value) return `${dayjs(value[0]).format('DD/MM')} - ${dayjs(value[1]).format('DD/MM/YYYY')}`;
		if (column.type === 'select' && Array.isArray(value)) {
			if (value.length === 0) return '';
			if (value.length === 1) {
				return column.options?.find(o => o.value === value[0])?.label || value[0];
			}
			return `${value.length} selected`;
		}
		return value;
	};

	return (
		<Popover
			content={renderPopoverContent()}
			title={column.title}
			trigger="click"
			open={isOpen}
			onOpenChange={setIsOpen}
			placement="bottomLeft"
		>
			{hasValue ? (
				// Active State: Tag-like Button
				<div
					className="inline-flex items-center bg-blue-50 text-blue-600 border border-blue-200 rounded px-2 py-1 cursor-pointer hover:bg-blue-100 transition-colors text-sm h-[32px]"
				>
					<span className="font-semibold mr-1">{column.title}:</span>
					<span className="mr-2">{getDisplayLabel()}</span>
					<CloseOutlined
						className="text-[10px] hover:text-red-500 p-1"
						onClick={(e) => {
							e.stopPropagation(); // Prevent reopening popover
							handleClear(e);
						}}
					/>
				</div>
			) : (
				// Inactive State: Dashed Button
				<Button
					type="dashed"
					icon={<PlusOutlined />}
					className="text-gray-500 border-gray-300 hover:text-blue-600 hover:border-blue-600 bg-white"
				>
					{column.title}
				</Button>
			)}
		</Popover>
	);
};


// --- Main Component ---
export default function FilterComponent({ columns, onFilterChange, onResetFields, className = '' }: IProps) {
	const [filterValues, setFilterValues] = useState<Record<string, any>>({});

	const handleChildChange = (key: string, value: any) => {
		const newFilters = { ...filterValues };
		if (value === null || value === undefined || value === '') {
			delete newFilters[key];
		} else if (Array.isArray(value) && value.length === 0) {
			delete newFilters[key];
		} else {
			newFilters[key] = value;
		}

		setFilterValues(newFilters);
		onFilterChange?.(newFilters);
	};

	const handleReset = () => {
		setFilterValues({});
		onResetFields?.();
	};

	const hasActiveFilters = Object.keys(filterValues).length > 0;

	return (
		<div className={`flex flex-wrap items-center gap-2 p-1 ${className}`}>
			{columns.map((col) => (
				<FilterItem
					key={col.dataIndex}
					column={col}
					value={filterValues[col.dataIndex]}
					onChange={(val) => handleChildChange(col.dataIndex, val)}
				/>
			))}

			{hasActiveFilters && (
				<Button
					type="text"
					size="small"
					onClick={handleReset}
					className="text-gray-500 hover:text-red-500 ml-2"
				>
					Reset <CloseOutlined className="text-[10px]" />
				</Button>
			)}
		</div>
	);
}