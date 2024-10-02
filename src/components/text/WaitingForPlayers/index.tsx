import React from 'react';

interface WaitingForPlayersProps {
  className?: string;
}

const WaitingForPlayers: React.FC<WaitingForPlayersProps> = ({ className = '' }) => {
  return (
    <div className={`text-muted-foreground text-sm text-center ${className}`}>Waiting for other players</div>
  );
};

export default WaitingForPlayers;