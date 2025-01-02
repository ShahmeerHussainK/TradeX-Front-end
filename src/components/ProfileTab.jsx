
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Button } from "./ui/button";
import { useCallback } from "react";
import { updateUsersDetail } from "@/api/users";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import CountrySelect from "./SelectCountry";

const InputField =({name, label, type = "text"})=>{
    const {register} = useFormContext()
    return (
        <div>
            <Label htmlFor="name">{label}</Label>
            <Input
                id="name"
                type={type}
                {...register(name)}
                className="mt-2 h-12 border-gray-700 bg-gray-800 text-white"
            />
        </div>
    )
}

export const ProfileTab = ({userInfo,handleUserProfile}) => {
    const { currentUser } = useAuth();
    const formInstance = useForm({
        values:userInfo,
    })
    const { register, handleSubmit } =formInstance
    const onSubmit=useCallback(async(values)=>{
        try{
            if(currentUser){
                const payload = {
                    first_name:values.firstName,
                    last_name:values.lastName,
                    email:values.email,
                    mobile_number:values.mobile,
                    address:values.address,
                    city:values.city,
                    country:values.country,
                    state:values.state,
                    zip_postal:values.zip,
                    name:`${values.firstName} ${values.lastName}`,
                }
                await updateUsersDetail(payload,currentUser.uid,currentUser.accessToken)
                await handleUserProfile()
                toast.success(`Profile updated successfully!`);
            }
        }
        catch(err){
          toast.error(`${err} error occured!`);
        } 
    
      },[currentUser, handleUserProfile])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...formInstance}>
            <div className="space-y-6">
                <InputField name="firstName" label="First Name" />
                <InputField name="lastName" label="Last Name" />
                <InputField name="email" label="Email" type="email" />
                <div className="flex flex-col">
                    <Label htmlFor="mobile"> Mobile Number </Label>
                    <div className="flex items-center">
                        <span className="flex h-12 mt-2 items-center rounded-md rounded-r-none border border-gray-700 bg-gray-200 text-black px-4 text-lg">
                            +
                        </span>
                        <Input
                            id="mobile"
                            type="tel"
                            placeholder="Mobile Number"
                            className="mt-2 h-12 border-gray-700 bg-gray-800 text-white"
                            required
                            {...register('mobile')}
                        />
                    </div>
                </div>
                <InputField name="address" label="Address" />
                <div className="flex flex-col">
                    <Label htmlFor="email" className="mb-2"> Country </Label>
                    <CountrySelect userProfileView />
                </div>
                <InputField name="city" label="City" />
                <InputField name="state" label="State" />
                <InputField name="zip" label="Zip/Postal Code" type="number" />
                <Button type="submit"
                    className="h-12 w-full bg-sky-800 text-white hover:bg-sky-700 sm:w-auto"> Submit </Button>
            </div>

        </FormProvider>
    </form>
  )
}
