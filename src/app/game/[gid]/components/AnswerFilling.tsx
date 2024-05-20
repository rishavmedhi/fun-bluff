import { Button } from "@/components/ui/button";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { useEffect, useState } from "react";

interface Props {
  gid: number,
  userStatus: userStatus
}

interface Options {
  id: number,
  user_option: string
}

function AnswerFilling({ gid, userStatus }: Props) {
  const [gameOptions, setGameOptions] = useState<Options[]>([]);
  const [submittedState, setSubmittedState] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const res = await clientApiFetch(`/api/game/${gid}/options`, {
        method: 'GET',
        headers: {
          deviceId: fetchUserDeviceId()
        }
      });
      if (!res.error) {
        setGameOptions(res.data.options)
      }
    }

    if (gid)
      init();
  }, [gid]);

  async function optionClick(optionId: number) {
    const res = await clientApiFetch(`/api/user/answer`, {
      method: 'POST',
      headers: {
        deviceId: fetchUserDeviceId()
      },
      body: {
        optionId: optionId,
        gameId: gid
      }
    });
    if(!res.error){
      setSubmittedState(true);
    }
  }

  return (
    <div className="flex justify-center flex-col gap-2 items-center">
      {gameOptions && gameOptions.length > 0 && gameOptions.map((opt) =>
        <Button key={opt.id} className="w-1/4" onClick={() => optionClick(opt.id)}>{opt.user_option}</Button>
      )}
    </div>
  )
}

export default AnswerFilling;