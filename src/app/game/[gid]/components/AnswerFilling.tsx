import { Button } from "@/components/ui/button";
import { userStatus } from "@/types/api/game/[gid]/responseTypes";
import { clientApiFetch } from "@/utils/apiFetch.utils";
import { fetchUserDeviceId } from "@/utils/user.utils";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import WaitingForPlayers from "@/components/text/WaitingForPlayers";
import ContentLoading from "@/components/ContentLoading";
interface Props {
  gid: number,
  userStatus: userStatus
}

interface Options {
  id: number,
  user_option: string
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

function AnswerFilling({ gid, userStatus }: Props) {
  const { toast } = useToast();
  const [gameOptions, setGameOptions] = useState<Options[]>([]);
  const [submittedState, setSubmittedState] = useState<boolean>(false);
  const [submittedOptionId, setSubmittedOptionId] = useState<number | null>(null);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(false);
  const [optionSelected, setOptionSelected] = useState<number | null>(null);
  useEffect(() => {
    async function init() {
      setOptionsLoading(true);
      const res = await clientApiFetch(`/api/game/${gid}/options`, {
        method: 'GET',
        headers: {
          deviceId: fetchUserDeviceId()
        }
      });
      if (!res.error) {
        setGameOptions(res.data.options)
      }
      setOptionsLoading(false);
    }

    if (gid)
      init();
  }, [gid]);

  useEffect(() => {
    if (userStatus?.answer_filling?.answerFilled) {
      setSubmittedState(true);
      setSubmittedOptionId(userStatus?.answer_filling?.answer || null);
    }
  }, [userStatus]);

  async function optionClick(optionId: number) {
    if (submittedState) {
      toast({
        title: "You have already submitted your answer",
        variant: "destructive"
      });
      return;
    }
    setOptionSelected(optionId);
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
    if (!res.error) {
      setSubmittedState(true);
      setSubmittedOptionId(optionId);
    }
    setOptionSelected(null);
  }

  return (
    <>
      <motion.div className="flex justify-center flex-col gap-6 items-center mt-10" variants={containerVariants} initial="hidden" animate="visible">
        {
          optionsLoading ? <ContentLoading loadingText="Loading options..."/> :
            gameOptions && gameOptions.length > 0 && gameOptions.map((opt) =>
              <motion.div variants={itemVariants} key={opt.id} className="w-full">
                <Button
                  variant={submittedOptionId === opt.id ? "default" : "outline"}
                  className="w-full text-md"
                  onClick={() => optionClick(opt.id)}
                  disabled={optionSelected !== null}
                >
                  {submittedOptionId === opt.id && <Check className="mr-2 h-4 w-4" />}
                  {optionSelected === opt.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {opt.user_option}
                </Button>
              </motion.div>
            )}
      </motion.div>
      {!optionsLoading && submittedState && <WaitingForPlayers className="mt-8" />}
    </>
  )
}

export default AnswerFilling;