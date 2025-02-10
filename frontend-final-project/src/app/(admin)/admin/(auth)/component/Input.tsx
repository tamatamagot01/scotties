type InputProp = {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
};

export default function Input({ label, type, value, onChange }: InputProp) {
  return (
    <div className="flex flex-col">
      <div className="w-20">
        <label className="text-sm">{label}</label>
      </div>
      <input
        className="px-2 border rounded-lg"
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
