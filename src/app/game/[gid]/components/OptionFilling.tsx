import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { useEffect, useState } from "react";

interface Props {
  gid: number,
  userStatus: userStatus
}

function OptionFilling({ gid, userStatus }: Props) {
  const [userOption, setUserOption] = useState<string>("");
  const [userOptionSubmitted, setUserOptionSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if(userStatus && userStatus.option_filling && userStatus.option_filling){
      if(userStatus.option_filling.optionFilled){
        setUserOptionSubmitted(true);
        setUserOption(userStatus.option_filling.option!);
      }
      else{
        setUserOptionSubmitted(false);
        setUserOption("");
      }
    }
    else{
      setUserOptionSubmitted(false);
      setUserOption("");
    }

  }, [userStatus])

  const submitOption = async () => {
    const res = await clientApiFetch("/api/user/option", {
      method: 'POST',
      body: {
        gameId: gid,
        userOption: userOption
      },
      headers: {
        deviceId: fetchUserDeviceId()
      }
    });
    if (!res.error) {
      setUserOptionSubmitted(true);
    }
  }

  return (
    <>
      <Input name="username" onChange={(e) => setUserOption(e.target.value)} value={userOption} placeholder="Enter your response"/>
      {
        !userOptionSubmitted ? <Button onClick={submitOption}>Submit</Button> : <div>Waiting for other players</div>
      }
    </>
  )
}

export default OptionFilling;