import { userStatus } from '@/types/api/game/[gid]/responseTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clientApiFetch } from '@/utils/apiFetch.utils';
import { fetchUserDeviceId } from '@/utils/user.utils';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import WaitingForPlayers from '@/components/text/WaitingForPlayers';

interface Props {
  gid: number;
  userStatus: userStatus;
}

function OptionFilling({ gid, userStatus }: Props) {
  const { toast } = useToast();
  const [userOption, setUserOption] = useState<string>('');
  const [userOptionSubmitted, setUserOptionSubmitted] =
    useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  useEffect(() => {
    if (userStatus && userStatus.option_filling && userStatus.option_filling) {
      if (userStatus.option_filling.optionFilled) {
        setUserOptionSubmitted(true);
        setUserOption(userStatus.option_filling.option!);
      } else {
        setUserOptionSubmitted(false);
        setUserOption('');
      }
    } else {
      setUserOptionSubmitted(false);
      setUserOption('');
    }
  }, [userStatus]);

  const submitOption = async () => {
    setSubmitLoading(true);
    try {
      const res = await clientApiFetch('/api/user/option', {
        method: 'POST',
        body: {
          gameId: gid,
          userOption: userOption,
        },
        headers: {
          deviceId: fetchUserDeviceId(),
        },
      });
      if (!res.error) {
        setUserOptionSubmitted(true);
      }
    } catch (e) {
      console.log(e);
      toast({
        'description': "Oops! Something went wrong!",
        'variant': 'destructive'
      })
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Input
        name="username"
        onChange={(e) => setUserOption(e.target.value)}
        value={userOption}
        placeholder="Enter your response"
        disabled={userOptionSubmitted}
      />
      {!userOptionSubmitted ? (
        <Button onClick={submitOption} className="w-full mt-8">
          {' '}
          {submitLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : null} Submit
        </Button>
      ) : (
        <WaitingForPlayers className="mt-8" />
      )}
    </>
  );
}

export default OptionFilling;
