import hashlib
import json
import uuid
import time


class Block:

    def __init__(self, idx: int, prev_hash: str, timestamp: float, uid: uuid.UUID):
        """
        :param idx: position in the chain
        :param prev_hash: hash of the previous block
        :param timestamp: time since UNIX epoch
        :param uid: uuid object
        num_iters: iteration number to get a valid hash
        """
        self.idx = idx
        self.prev_hash = prev_hash
        self.creation_timestamp = timestamp
        self.uid_str = str(uid)
        self.num_iters = 0
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps(self.__dict__, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()
    

class Blockchain:

    def __init__(self):
        """
        :function: initialise blockchain list and create the starting block
        """
        self.chain = []
        self.chain.append(Block(0, "0", time.time(), uuid.uuid4()))
        

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_block(self, new_block: Block) -> None:
        """
        :param new_block: new Block object to add to the blockchain
        :function: updates the hash of the new block and adds it to chain
        """
        new_block.previous_hash = self.get_latest_block().hash
        # proof_of_work function used to ensure new block meets the desired criteria
        new_block.hash = self.proof_of_work(new_block)
        self.chain.append(new_block)

    def proof_of_work(self, block: Block) -> str:
        block.num_iters = 0
        calculated_hash = block.calculate_hash()
        while not calculated_hash.startswith('0' * self.difficulty):
            block.num_iters += 1
            calculated_hash = block.calculate_hash()
        return calculated_hash

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if current_block.hash != current_block.calculate_hash():
                return False
            if current_block.previous_hash != previous_block.hash:
                return False
        return True
