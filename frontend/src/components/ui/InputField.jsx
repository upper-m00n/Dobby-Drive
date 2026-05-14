import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const InputField = forwardRef(({ label, id, icon: Icon, error, type = 'text', ...props }, ref) => {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="block text-[14px] font-medium text-zinc-300 mb-2.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-zinc-500 transition-colors duration-300 group-focus-within:text-indigo-400" />
        )}
        <input
          id={id}
          ref={ref}
          type={inputType}
          style={{ 
            paddingLeft: Icon ? '52px' : '20px', 
            paddingRight: isPassword ? '52px' : '20px' 
          }}
          className={`w-full bg-white/[0.03] hover:bg-white/[0.05] border ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20'
          } rounded-[16px] text-[16px] text-white placeholder:text-zinc-600 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:ring-4 h-[56px] shadow-inner`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-xl hover:bg-white/5"
          >
            {showPass ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[13px] text-red-400 mt-2 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
