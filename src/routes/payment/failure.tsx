import { createFileRoute } from '@tanstack/react-router'
import { Image } from 'antd';
import { useEffect } from 'react';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10">
      <div className="relative">
        <Image
          src="/assets/images/error.png"
          alt="success"
          width={200}
          height={200}
          className="object-cover w-32 h-32"
        />
      </div>
      <div className="md:text-5xl text-3xl text-primary-blue-cus text-center font-semibold transition-all duration-500">
        Thanh toán thất bại!
      </div>
    </div>
  );
};

export const Route = createFileRoute('/payment/failure')({
  component: Page,
})