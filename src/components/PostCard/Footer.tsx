import VotingButton from "@/components/ButtonVoteComponent/VotingButton";
import { usePostContext } from "@/contexts/PostContext";
import { useHiveUser } from "@/contexts/UserContext";
import { HiveAccount } from "@/lib/useHiveAuth";
import { Badge, CardFooter, HStack, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";

interface FooterProps {
  username?: string;
}

export default function Footer({ username }: FooterProps) {
  const { post } = usePostContext();
  const [postEarnings, setPostEarnings] = useState(Number(post.getEarnings().toFixed(2)));
  const [isValueTooltipOpen, setIsValueTooltipOpen] = useState(false);
  const { hiveUser, voteValue } = useHiveUser();

  const usernameString = username
    ? typeof username === "string"
      ? username
      : (username as HiveAccount)?.name || ""
    : hiveUser?.name || "";



  return (
    <CardFooter p={2} flexDirection={"column"} gap={1} key={hiveUser?.name}>
      <HStack justifyContent="space-between" width="100%">
        <VotingButton comment={post} username={usernameString} />

        <Tooltip
          label={`+$${voteValue.toFixed(6)}`}
          placement="top"
          isOpen={isValueTooltipOpen}
          hasArrow
        >
          <Badge
            fontWeight={"bold"}
            color={"green.400"}
            cursor={"pointer"}
            fontSize={"1rem"}
          >
            ${postEarnings.toFixed(2)}
          </Badge>
        </Tooltip>
      </HStack>
    </CardFooter>
  );
}
