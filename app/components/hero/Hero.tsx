'use client';

import Container from '../Container';
import Button from '../Button';
import { useTypingEffect } from '@/app/hooks/useTypingEffect';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle?: string;
  typingWords: string[];
  typingStaticWords: string;
  center?: boolean;
  image?: string;
}

const Hero = ({ title, subtitle, typingWords, image, typingStaticWords, center }: HeroProps) => {
  const router = useRouter();

  return (
    <div className={`w-full h-full overflow-hidden relative mix-blend-overlay ${!image && 'bg-cambio-blue'}`}>
      {image && (
        <>
          <Image
            src={imgPrefix + image}
            alt="Hero"
            fill
            style={{
              objectFit: 'cover',
              zIndex: -1,
              backgroundPosition: 'center',
              filter: 'blur(2px)',
              opacity: 0.5,
            }}
            quality={100}
          />
          <div className="absolute -z-10 bg-gradient-to-r from-cambio-blue from-10% via-white to-cambio-blue to-90% h-full w-full" />
        </>
      )}

      <Container styles="relative z-10 h-[70vh] min-h-[650px] max-h-[850px]">
        <div
          className={`flex flex-col justify-center ${center && 'items-center'} h-full w-full text-neutral-800 pt-16`}
        >
          <div className="max-w-[950px]">
            <p className={`mt-3 text-2xl pb-16 ${center && 'text-center'}`}>
              {typingStaticWords} {useTypingEffect(typingWords, 75, 50, 1000)}
              <span className="text-cambio-red">|</span>
            </p>
            <h1 className={`text-6xl font-bold pb-16 ${center && 'text-center'}`}>{title}</h1>
            {subtitle && <div className={`text-2xl font-semibold ${center && 'text-center'}`}>{subtitle}</div>}
          </div>
          <div className="w-[700px] h-[175px] flex flex-col-reverse">
            <div className="w-full h-[75px] flex gap-8">
              <Button
                label="Try it for Free"
                onClick={() => {
                  router.push('/sandbox');
                }}
              />
              <Button
                label="Live Benchmarking Demo"
                onClick={() => {
                  router.push('/book-demo');
                }}
                outline
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
