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