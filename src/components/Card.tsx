// 1. Define the "shape" of the data this component accepts
type CardProps = {
  title: string;
  description: string;
};

// 2. Add the type to the function props
export default function Card({ title, description }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}