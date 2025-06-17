import _axios from "@/utils/_axios"

export const combineRGB = (redBondId, greenBondId, blueBondId, stretchMode) => {
    return _axios.get("/operation/combineRGB", {
        params: {
            redBondId,
            greenBondId,
            blueBondId,
            stretchMode
        }
    })
}
// // NDVI 植被指数计算
export function computeNDVI(redBandId,nirBandId) {
      return _axios.get("/operation/ndvi", {
       params: {
            redBandId,
            nirBandId,
        }
    })
}