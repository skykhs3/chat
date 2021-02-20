import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
class RoomCreatePage extends React.Component{
    render(){
         return (<div>

            <form className="form">
            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="방 이름"
            inputProps={{
                maxLength: 50,
              }}
            >
                
            </TextField>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
            >만들기</Button>
            </form>
            
            
            </div>);
    }

}
export default RoomCreatePage;