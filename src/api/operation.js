import _axios from "@/utils/_axios"

export const combineRGB = (redBondId, greenBondId, blueBondId, stretchMode) => {
    return _axios.get("http://47.109.197.221:8080/api/operation/combineRGB", {
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
      return _axios.get("http://47.109.197.221:8080/api/operation/ndvi", {
       params: {
            redBandId,
            nirBandId,
        }
    })
}