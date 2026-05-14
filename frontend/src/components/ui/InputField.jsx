import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = forwardRef(({ label, id, icon: Icon, error, type = 'text', ...props }, ref) => {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col mb-5">
      {label && (
        <label htmlFor={id} className="block text-[14px] font-medium text-zinc-300 mb-2.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-zinc-500 transition-colors group-focus-within:text-indigo-400" />
        )}
        <input
          id={id}
          ref={ref}
          type={inputType}
          style={{ 
            paddingLeft: Icon ? '48px' : '16px', 
            paddingRight: isPassword ? '48px' : '16px' 
          }}
          className={`w-full bg-white/[0.04] border ${
            error ? 'border-red-500/50' : 'border-white/10'
          } rounded-[14px] text-[15px] text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:bg-white/[0.06] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 h-[52px]`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-lg"
          >
            {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        )}
      </div>
      {error && <p className="text-[13px] text-red-400 mt-1.5">{error}</p>}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
