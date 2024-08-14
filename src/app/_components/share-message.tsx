import { Modal } from 'antd'
import React from 'react'
import { WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon, TwitterIcon, TwitterShareButton } from 'react-share';

function ShareMessage({
    open, setOpen, messageToShare
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    messageToShare: string;
}) {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            title="Share Message"
            centered
            footer={null}>

                <div className='flex gap-5'>
                    <WhatsappShareButton url={messageToShare}>
                        <WhatsappIcon size={32} round></WhatsappIcon>
                    </WhatsappShareButton>

                    <TwitterShareButton url={messageToShare}>
                        <TwitterIcon size={32} round></TwitterIcon>
                    </TwitterShareButton>

                    <LinkedinShareButton url={messageToShare}>
                        <LinkedinIcon size={32} round></LinkedinIcon>
                    </LinkedinShareButton>
                </div>
        </Modal>
    );
}

export default ShareMessage;