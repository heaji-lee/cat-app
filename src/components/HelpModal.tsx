import { Button, Modal } from "@heroui/react";
import { useNavigate } from "react-router-dom";

type HelpModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function HelpModal({ isOpen, setIsOpen }: HelpModalProps) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-90">
          <>
            <Modal.Header>
              <Modal.Heading className="font-[Galindo]">Welcome to the Cat App 🐾</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❓</span>
                <div>
                  <h3 className="font-semibold text-lg">What is this app?</h3>
                  <p className="text-sm text-gray-600">
                    Manage your own cat collection, vote 👍 / 👎, and save your favourites ❤️.
                  </p>
                </div>
              </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-lg">Why can't I upload my cat image?</h3>
                    <p className="text-sm text-gray-600">
                      Make sure your image is a .jpg, .jpeg, .png, or .gif file and under the size limit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🐾</span>
                  <div>
                    <h3 className="font-semibold text-lg">Whose is that cat on the nav bar?</h3>
                    <p className="text-sm text-gray-600">
                      That's Moo, the app creator's cat! 😸 Click{" "}
                      <span
                        className="underline cursor-pointer text-blue-500"
                        onClick={() => {
                          setIsOpen(false);
                          setTimeout(() => navigate("/moo"), 0);
                        }}
                      >
                        here
                      </span>
                        {" "}to find more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">☎️</span>
                  <div>
                    <h3 className="font-semibold text-lg">Need to contact me?</h3>
                    <p className="text-sm text-gray-600">
                      You can reach me at helenheajilee@gmail.com for any questions or feedback! 🫡
                    </p>
                  </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
              <Button className="w-full" onClick={() => setIsOpen(false)}>
                Got it 😺
              </Button>
            </Modal.Footer>
          </>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}