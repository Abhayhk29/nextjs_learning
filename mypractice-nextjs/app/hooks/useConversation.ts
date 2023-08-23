import {useParams} from 'next/navigation';
import {useMemo} from "react";

const useConversation = () => {
  const params = useParams();

  const conversionId = useMemo(() => {
    if(!params?.conversationId){
        return ''
    }

    return params.conversationId as string
  },[params?.conversationId]);

  const isOpen = useMemo(() => !!conversionId, [conversionId]);

  return useMemo(() => ({
    isOpen,
    conversionId
  }),[isOpen, conversionId]);
}

export default useConversation;