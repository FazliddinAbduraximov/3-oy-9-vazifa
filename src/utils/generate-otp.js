import {generate} from 'otp-generator';

export const generateOtp=()=>{
    return generate(6,{
        upperCaseAlphabets:false,  //katta hariflarni bloklash
        lowerCaseAlphabets:false,   // kichik hariflarni boloklash
        specialChars:false,      // belgilarni bloklash
        // digits:false        //  Raqamlarni bloklash
    })
}