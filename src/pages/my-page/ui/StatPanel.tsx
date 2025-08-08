import type { FunctionComponent } from 'react';

const StatPanel: FunctionComponent = () => {
  return (
    <div className="relative w-full flex flex-row items-center justify-start gap-[1.562rem] text-center text-[1.625rem] text-darkslategray font-montserrat">
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[0]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[1]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[2]" />
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[3.063rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem] z-[3]">
        최고 집중 시간대
      </div>
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[28.375rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem] z-[4]">
        최저 집중 시간대
      </div>
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[54.125rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem] z-[5]">
        평균 집중 유지 시간
      </div>
      <div className="w-[19.063rem] absolute !!m-[0 important] top-[6.25rem] left-[2.313rem] text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-lightseagreen inline-block h-[5.625rem] z-[6]">
        오전 6시~오전8시
      </div>
      <div className="w-[19.063rem] absolute !!m-[0 important] top-[6.25rem] left-[27.625rem] text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-lightseagreen inline-block h-[4.788rem] z-[7]">{`오후 1시~오후2시 `}</div>
      <div className="w-[18.875rem] absolute !!m-[0 important] top-[6.438rem] left-[53.5rem] text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-lightseagreen inline-block h-[5.125rem] z-[8]">
        1시간 5분
      </div>
      <div className="w-[2.5rem] absolute !!m-[0 important] top-[1.438rem] left-[69.875rem] h-[3.313rem] z-[9] text-[0.625rem] text-tomato">
        <div className="absolute top-[0rem] left-[0rem] rounded-[50px] w-[2.5rem] h-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-[0.625rem] box-border">
          <img
            className="w-[1.5rem] relative h-[1.5rem] overflow-hidden shrink-0"
            alt=""
            src="bx-comment.svg.svg"
          />
        </div>
        <div className="absolute top-[0.813rem] left-[0.125rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block w-[2.375rem] h-[2.5rem]">
          ?
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
