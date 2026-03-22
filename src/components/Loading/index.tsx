const LoadingComponent = () => {
  return (
    <div className="relative flex w-full items-center justify-center">
      <div
        className="
          w-8 aspect-square rounded-full p-0.75 animate-[spin_2s_infinite]
          [background:radial-gradient(farthest-side,#ec97b2_95%,#0000)_50%_0/10px_10px_no-repeat,radial-gradient(farthest-side,#0000_calc(100%-3px),#ec97b2_calc(100%-2px))_content-box]
        "
      />
    </div>
  )
}

export default LoadingComponent
