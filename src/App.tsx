import React, { useCallback, useRef, useState } from 'react'
import pixelmatch from 'pixelmatch'

import './App.css'

function App() {
  const [cv, setCv] = useState<any>([])
  const canvasRefF = useRef<HTMLCanvasElement>(null)
  const canvasRefS = useRef<HTMLCanvasElement>(null)
  const canvasDiffRef = useRef<HTMLCanvasElement>(null)

  const handleImage = useCallback((files: FileList, ref: React.RefObject<HTMLCanvasElement>) => {
    var reader = new FileReader()

    reader.readAsDataURL(files[0])
    reader.onload = function (event: any) {
      var img = new Image()

      img.src = event.target.result
      img.onload = function () {
        const canvas = ref.current

        canvas!.width = img.width
        canvas!.height = img.height
        canvas!.getContext('2d')?.drawImage(img, 0, 0)
        setCv((res: any) => {
          return [...res, 1]
        })
      }
    }
  }, [])

  const diffUi = () => {
    const img1Ctx = canvasRefF.current?.getContext('2d')
    const img2Ctx = canvasRefS.current?.getContext('2d')
    const diffCtx = canvasDiffRef.current?.getContext('2d')
    const width = canvasRefF.current?.width
    const height = canvasRefF.current?.height

    const img1 = img1Ctx?.getImageData(0, 0, width!, height!)
    const img2 = img2Ctx?.getImageData(0, 0, width!, height!)
    let diff = diffCtx?.createImageData(width!, height!)

    pixelmatch(img1!.data, img2!.data, diff!.data, width!, height!, {
      threshold: 0.1,
    })

    canvasDiffRef.current!.width = width!
    canvasDiffRef.current!.height = height!
    diffCtx?.putImageData(diff!, 0, 0)
    setCv((res: any) => {
      return [...res, 1]
    })
  }

  return (
    <div className="App">
      <div className="files">
        <div className="file-div">
          <div className="file">
            <div>选择设计图片</div>
            <input
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleImage(e.target.files!, canvasRefF)
              }}
            />
          </div>
          <canvas
            ref={canvasRefF}
            style={{
              display: cv[0] ? 'block' : 'none',
            }}></canvas>
        </div>
        <div className="file-div">
          <div className="file f1">
            <div>选择实现截图</div>
            <input
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleImage(e.target.files!, canvasRefS)
              }}
            />
          </div>
          <canvas
            ref={canvasRefS}
            style={{
              display: cv[1] ? 'block' : 'none',
            }}></canvas>
        </div>
      </div>
      <canvas
        className="diffc"
        ref={canvasDiffRef}
        style={{
          display: cv[2] ? 'block' : 'none',
        }}></canvas>
      <div className="el-button" onClick={diffUi}>
        对比
      </div>
    </div>
  )
}

export default App
