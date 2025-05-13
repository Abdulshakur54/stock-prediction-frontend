import * as Yup from 'yup'

export default function val(entity){
    switch(entity){
        case 'username':
            return Yup.string().required("required").min(3, "minimum of 3 characters").max(15, "maximum of 15 characters").matches(/^[a-zA-Z]+$/)
        case 'email':
            return Yup.string().required("required").email("invalid email entered")
        case 'password':
            return Yup.string().required("required").min(8, "minimum of 8 characters").max(18, "maximum of 18 characters").matches(/^[\w!@#$]+$/)
        default:
            return entity
    }
}