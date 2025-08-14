import { FooterCompanyInfo } from './FooterCompanyInfo';
import { FooterLogo } from './FooterLogo';

export const Footer = () => {
  return (
    <footer className="bg-footer-bg p-[3.75rem] h-[20rem]">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* 회사 정보 섹션 */}
        <section className="flex flex-col gap-6 flex-1">
          <FooterLogo />
          <FooterCompanyInfo />
        </section>

        {/* 구분선 */}
        <hr className="w-full h-px bg-white my-8 border-0" />

        {/* 저작권 및 링크 섹션 */}
        <section className="flex justify-between items-center">
          <p
            className="text-footer-text font-semibold text-[1rem] font-['Plus_Jakarta_Sans']"
            style={{ letterSpacing: '-0.32px' }}
          >
            ©2025 Smore. All rights reserved
          </p>
          {/* <GitLabLink /> */}
        </section>
      </div>
    </footer>
  );
};
