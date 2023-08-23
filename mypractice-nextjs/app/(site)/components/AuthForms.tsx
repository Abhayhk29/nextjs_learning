'use client';
import { useCallback, useState, useEffect } from "react";
import { useForm , FieldValues, SubmitErrorHandler} from "react-hook-form";

import { BsGithub, BsGoogle } from 'react-icons/bs';
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from 'next-auth/react'

type Variant = 'LOGIN' | 'REGISTER'
const AuthForm = () => {
    const session = useSession();
    const [variant, setVariant] =  useState<Variant>('LOGIN');
    const [isLoading, SetISLoading] = useState(false);

    useEffect(() => {
      if(session?.status === 'authenticated'){
        console.log("user logged in")
      }
    }, [session?.status])
    

    const toggleVarraint = useCallback(() => {
        if(variant === 'LOGIN'){
            setVariant('REGISTER')
        }else{
            setVariant('LOGIN')
        }
    },[variant])

    const {
        register,
        handleSubmit,
        formState:{
            errors
        }
    } = useForm<FieldValues>({
        defaultValues:{
            name: '',
            email:'',
            password:''
        }
    });

    const onSubmit : SubmitErrorHandler<FieldValues> = (data) => {
        SetISLoading(true);

        if(variant === 'REGISTER'){
            // Axios Register
            axios.post('/api/register', data)
            .catch(() => {
                toast.error('Some thing went wrong')
            }).finally(() => {
                SetISLoading(false);
            })
        }

        if(variant === 'LOGIN'){
            // nextauth sign
            signIn('credentials', {
                ...data,
                redirect: false
            }).then((callback) => {
                if(callback?.error){
                    toast.error('Invalide credentials')
                }

                if(callback?.ok && !callback?.error){
                    toast.success('Logged in user');
                }
            }).finally(() => {
                SetISLoading(false);
            })

            

        }
    }

    const socialAction = (action : string) => {
        SetISLoading(true);
        // nextAuth Social Sign in
        signIn(action, {
            redirect: false
        }).then((callback) => {
            if(callback?.error){
                toast.error('Invalide errpr');
            }

            if(callback?.ok && !callback?.error){
                toast.success("Logged In!")
            }
        }).finally(() => {
            SetISLoading(false);
        })
    }
    return(
        <div className="
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
        ">
            <div
                className="
                bg-white
                px-4
                py-8
                shadow
                sm:rounded-lg
                sm:px-10
                "
            >
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    
                    {variant === 'REGISTER' && (
                        <Input
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        // required
                        id="name" 
                        label="Name"
                        />
                    )}
                    <Input 
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        // required
                        id="email" 
                        label="Email address" 
                        type="email"
                    />
                    <Input 
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        // required
                        id="password" 
                        label="Password" 
                        type="password"
                    />
                    <div>
                    <Button disabled={isLoading} fullWidth type="submit">
                        {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                    </Button>
                </div>

                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div 
                        className="
                            absolute 
                            inset-0 
                            flex 
                            items-center
                        "
                        >
                        <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            Or continue with
                        </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton 
                        icon={BsGithub} 
                        onClick={() => socialAction('github')} 
                        />
                        <AuthSocialButton 
                        icon={BsGoogle} 
                        onClick={() => socialAction('google')} 
                        />
                    </div>
                    </div>
                    <div 
                    className="
                        flex 
                        gap-2 
                        justify-center 
                        text-sm 
                        mt-6 
                        px-2 
                        text-gray-500
                    "
                    >
                    <div>
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'} 
                    </div>
                    <div 
                        onClick={toggleVarraint} 
                        className="underline cursor-pointer"
                    >
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                    </div>
                </div>
            </div>
    )
}

export default AuthForm;