import {createMuiTheme} from "@material-ui/core/styles"
import {grey, yellow} from "@material-ui/core/colors"

const theme = createMuiTheme({
    palette: {
        primary:{
          main: '#000000'
        },
        secondary:{
          main:yellow[400]
        },
        background:{
         default:grey[400],
        }
    }
})

export default theme