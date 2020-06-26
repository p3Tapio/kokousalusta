import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button';

const HelpPop = ({ text, placement, heading, btnText, variant, style }) => {


    return (
        <>
            <OverlayTrigger
                trigger="click"
                key={placement}
                placement={placement}
                overlay={
                    <Popover id={`popover-positioned-${placement}`}>
                        <Popover.Title as="h3">{heading}</Popover.Title>
                        <Popover.Content className="text-justify p-3">
                            {text}
                        </Popover.Content>
                    </Popover>
                }
            >
                <Button variant={variant} style={style}>{btnText}</Button>
            </OverlayTrigger>
        </>
    )
}
export default HelpPop
