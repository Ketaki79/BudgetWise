import React from 'react';

const InputGroup = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all
          ${error
            ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
            : 'border-slate-200 bg-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }`}
      />

      {error && (
        <p className="text-red-500 text-[11px] font-semibold mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputGroup;
